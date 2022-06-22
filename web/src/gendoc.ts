/**
 * Documentation generator. Outputs Swagger JSON configuration.
 */

import { readFileSync } from 'fs'
import * as ts from 'typescript'
import joiToSwagger from 'joi-to-swagger'

function getEnumKeyByEnumValue(myEnum: any, enumValue: any) {
    const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue)
    return keys.length > 0 ? keys[0] : null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function nodeName(node: ts.Node) {
    return getEnumKeyByEnumValue(ts.SyntaxKind, node.kind)
}

interface RouteDescription {
    path: string
    method: string

    authentication: boolean
    roles?: string

    requestSchema: boolean
    responseSchema: boolean

    requestDTOs?: any
    responseDTO?: string
}

function findRoutes(fileName: string): Array<RouteDescription> {
    const rootPath = fileName.replace('controllers/', '').replace('.ts', '')
    const sourceFile = loadFile(fileName)

    const routes: Array<RouteDescription> = []
    exploreNode(sourceFile)

    function exploreNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.CallExpression && node.getChildAt(0).getText().includes('router')) {
            const callNode = <ts.CallExpression>node

            const newPath = `/${rootPath}${(<ts.StringLiteral>callNode.arguments[0]).text}`
            const routeDescr = <RouteDescription>{
                path: newPath.replace(/:(\w+)/g, '{$1}'),
                method: node.getChildAt(0).getText().split('.')[1],
                authentication: false,
                requestSchema: false,
                responseSchema: false,
            }

            for (let i = 1; i < callNode.arguments.length; ++i) {
                const argNode = callNode.arguments[i]
                if (argNode.kind === ts.SyntaxKind.CallExpression) {
                    const argNodeCall = <ts.CallExpression>argNode

                    const text = argNode.getText()
                    if (text.includes('authenticated')) {
                        routeDescr.authentication = true
                        if (argNodeCall.arguments.length === 0) {
                            routeDescr.roles = 'ALL'
                        } else {
                            routeDescr.roles = argNodeCall.arguments[0].getText()
                        }
                    } else if (text.includes('validator')) {
                        routeDescr.requestSchema = true
                        if (routeDescr.requestDTOs === undefined) {
                            routeDescr.requestDTOs = {}
                        }

                        const contentType = argNodeCall.expression.getText().split('.')[1]
                        routeDescr.requestDTOs[contentType] = argNodeCall.arguments[0].getText()
                    }
                }
            }

            routes.push(routeDescr)
        }

        ts.forEachChild(node, exploreNode)
    }

    return routes
}

async function findDTOs(fileName: string): Promise<any> {
    const result = {} as { [key: string]: any }
    const targetModule = await import(fileName)
    for (const key in targetModule) {
        if (key.includes('Schema')) {
            result[key] = targetModule[key]
        }
    }
    return result
}

function loadFile(fileName: string) {
    return ts.createSourceFile(
        fileName,
        readFileSync(fileName).toString(),
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ true
    )
}

async function main() {
    console.log('--- Configuration generator ---')
    console.log('[i] Generating...')

    const modules = ['users', 'auth']

    const swaggerConfig = {
        openapi: '3.0.0',
        info: {
            title: 'PuppyHub API',
            description: '',
            version: '0.0.1',
        },

        paths: {},
        components: {
            schemas: {},
        },
    } as any

    let existingComponents: any = {}
    const results: any = {}
    for (const m of modules) {
        const routes = findRoutes(`controllers/${m}.ts`)
        const singName = m.charAt(m.length - 1) === 's' ? m.substring(0, m.length - 1) : m
        const dtos = await findDTOs(`./models/dtos/${singName}`)

        for (const schemaName in dtos) {
            const { swagger, components } = joiToSwagger(dtos[schemaName], existingComponents)
            existingComponents = { existingComponents, ...components }
            results[schemaName] = swagger
        }

        for (const route of routes) {
            if (swaggerConfig.paths[route.path] === undefined) {
                swaggerConfig.paths[route.path] = {}
            }

            // TODO: add response schema
            const routeConfig = {
                tags: [m],
                responses: {
                    200: {
                        description: 'Successful',
                        content: {
                            'application/json': {},
                        },
                    },
                },
            } as any

            if (route.authentication) {
                routeConfig['description'] =
                    'It requires **authentication**. Get your JWT token from /auth/login and use Bearer authentication.'
                if (route.roles !== undefined) {
                    routeConfig['description'] += `\n\nRequired user role: **${route.roles}**`
                }
            }

            if (route.requestSchema) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                for (const sche in route.requestDTOs!) {
                    if (sche === 'body') {
                        routeConfig['requestBody'] = {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: { $ref: `#/components/schemas/${route.requestDTOs[sche]}` },
                                },
                            },
                        }
                    } else if (sche === 'query' || sche === 'params') {
                        routeConfig['parameters'] = []
                        const props = results[route.requestDTOs[sche]].properties
                        for (const prop in props) {
                            routeConfig['parameters'].push({
                                in: sche === 'params' ? 'path' : sche,
                                name: prop,
                                required: true,
                                schema: { type: props[prop].type },
                            })
                        }
                    }
                }
            }
            swaggerConfig.paths[route.path][route.method] = routeConfig
        }
    }
    swaggerConfig.components.schemas = results

    console.log('[+] Done. Your Swagger config is below.')
    console.log(JSON.stringify(swaggerConfig))
}

main()

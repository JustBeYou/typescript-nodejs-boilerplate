import dotenv from 'dotenv'

// Setup command line options
export function loadConfig() {
  // Set the env file
  const result2 = dotenv.config({
    path: `.env`,
  })

  if (result2.error) {
    throw result2.error
  }
}

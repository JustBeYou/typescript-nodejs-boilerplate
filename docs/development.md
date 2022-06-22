Development guide
===

## Install requirements
0. A `*nix` system is preferred (like `GNU/Linux`, `MacOS`, etc) but not mandatory.
1. We recommend you to use `VSCode` for development as it has great integration with technologies used. You can use any editor you like.
2. Install `docker` and `docker-compose`.
3. Install `node` and `npm`. (at the moment we use `16.15.1` for the official build, but any `stable` version is alright. We recommend to use `nvm` to manage your node versions)
4. Run `npm install` inside `backend/web`.

## Running the project
1. To start the backend you simply need to go in `backend/` and run `./scripts/dev.sh`. If you are using Windows you can use `./scripts/dev.bat`. Now backend API should be available at `localhost:3000`.

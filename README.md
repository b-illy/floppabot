# floppabot

## overview

A general purpose modular Discord bot written in JS using [eris](https://github.com/abalabahaha/eris).

## dependencies

- `nodejs` - This project was made with recent nodejs versions in mind (~`18.x` and later) so check the version provided by your package manager. For instance, Ubuntu 22.04 LTS provides `12.x` which will not work (most linux distros won't have issues as Ubuntu is notoriously out-of-date). For Windows and macOS users an easy installer can be found [here](https://nodejs.org/en/download/prebuilt-installer/current). 
- `npm` - Any modern version should work fine, LTS or otherwise. Development and testing was performed primarily on `10.x`, but it's unlikely that different versions will have issues (report them if you encounter any). For Windows and macOS users, a suitable version should be bundled when installing nodejs, and this may also be true for many linux distros.
- npm package dependencies - These will all be installed with a simple `npm install` (as covered in the setup section directly below). See `package.json` for a list of these dependencies.

## setup

- Access the [developer portal](https://discord.com/developers/applications). You will need to create a new application and a new bot account for that application - keep the token handy.
- Download the latest release of the source code from the [releases tab](https://github.com/b-illy/floppabot/releases) and extract, or clone the repository directly (may be unstable).
- Setup the `.env` file, using `.env-example` as a base to guide you.
- Run `npm install` in the base directory of the repository (the one containing `package.json`) to install all npm dependencies.
- Further information on setting up the bot account and inviting to servers is not provided here but is relatively straightforward and is easily accessible online.

## running

Run using `npm start` in the base directory of the repository.

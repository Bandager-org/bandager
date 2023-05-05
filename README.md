# Bandager
Bandager is a fully free and open source backend for [discord](https://discord.com) plugins (such as the one in [vencord](https://vencord.dev)) that gives you custom badges, animated avatars, and banners absolutely free!

## How to install
Currently, Bandager is in beta, and has no running public instances. Furthermore, no plugins have been added and/or listed for any client mods. However, if you would like to install Bandager, you can do so by following the [building](#building) instructions.


## Building
Bandager is written in typescript, meaning you will need to have [nodejs](https://nodejs.org), and git installed. Once you have nodejs installed, you can clone the repository and install the dependencies by running the following commands:
```bash
npm i -g pnpm
git clone https://github.com/bandager-org/bandager
cd bandager
pnpm i
```

From here, you can do a number of things. You can see all the predefined scripts in the package.json file, but here are some of the most useful ones:
- `start`: Runs Bandager, without the webui
- `no-setup`: Runs Bandager, without the webui, and without setting up the database. Bandager will use an ephemeral database, meaning that all data will be lost when the process is killed.
- `experimental-webui`: Same as start, but with the webui
- `experimental-webui-no-setup`: basically `experimental-webui` and `no-setup` combined

To run one of these scripts, you can run `pnpm run <script>`, for example, `pnpm run start`.

This is only for the backend. For the vencord plugin, which uses the backend, see [Bandager-org/VencordPlugin](https://github.com/Bandager-org/VencordPlugin)


## Contributing
If you would like to contribute to Bandager, you can do so by forking the repository, making your changes, and then opening a pull request. Please make sure your code passes the linter, and that you have tested your changes before opening a pull request.

## License
Bandager is licensed under [AGPL v3](https://choosealicense.com/licenses/agpl-3.0/) which means you are free to use, modify, and distribute the software, as long as you provide the source code to the end user, and any changes you make to the software are also licensed under AGPL v3. For more information, see the [license](LICENSE) file.

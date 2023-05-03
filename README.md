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


## Contributing
If you would like to contribute to Bandager, you can do so by forking the repository, making your changes, and then opening a pull request. Please make sure your code passes the linter, and that you have tested your changes before opening a pull request.

## License
Currently, as you can see, there is no license. This is going to change soon, but you are free to use Bandager and it's code as you wish, as long as you do not claim it as your own.

###### (I have no idea if that's how licenses work, but I'm  going to assume it is)
/**
 * @author Luuxis
 * Luuxis License v1.0 (voir fichier LICENSE pour les détails en FR/EN)
 */
import { config, database, logger, changePanel, appdata, setStatus, pkg, popup, setBackground } from '../utils.js'
const skinview3d = require('skinview3d');

const { Launch } = require('minecraft-java-core')
const { shell, ipcRenderer } = require('electron')

class Home {
    static id = "home";
    async init(config) {
        this.config = config;
        this.db = new database();
        this.currentServerIndex = 0;
        this.instancesList = [];
        this.skinViewer = null;

        await this.initSkinViewer();
        await this.loadServers();

        document.querySelector('.settings-btn').addEventListener('click', e => changePanel('settings'))
        document.querySelector('.play-btn').addEventListener('click', () => this.startGame())

        // Navigation
        document.querySelector('.nav-left').addEventListener('click', () => this.navigateServer(-1));
        document.querySelector('.nav-right').addEventListener('click', () => this.navigateServer(1));
    }

    async initSkinViewer() {
        let canvas = document.getElementById("skin-viewer");
        let configClient = await this.db.readData('configClient');
        let auth = await this.db.readData('accounts', configClient.account_selected);

        // Determine skin URL
        let skinUrl = "https://textures.minecraft.net/texture/1a4af718455d4aab528e7a61f86fa25e6a369d1768dcb13f7df319a713eb810b"; // Default Steve
        if (auth?.profile?.skins && auth.profile.skins.length > 0) {
            skinUrl = auth.profile.skins[0].url;
        }

        this.skinViewer = new skinview3d.SkinViewer({
            canvas: canvas,
            width: 500,
            height: 600,
            skin: skinUrl
        });

        // Set initial animation
        this.skinViewer.animation = new skinview3d.WalkingAnimation();
        this.skinViewer.animation.speed = 0.5;

        // Adjust camera
        this.skinViewer.camera.position.z = 60;
        this.skinViewer.zoom = 0.8;
        this.skinViewer.fov = 70;
    }

    async loadServers() {
        let configClient = await this.db.readData('configClient')
        let auth = await this.db.readData('accounts', configClient.account_selected)
        let allInstances = await config.getInstanceList()

        // Filter by whitelist
        this.instancesList = [];
        for (let instance of allInstances) {
            if (instance.whitelistActive) {
                let whitelist = instance.whitelist.find(w => w == auth?.name)
                if (whitelist !== auth?.name) continue;
            }
            this.instancesList.push(instance);
        }

        // Find selected instance index
        let instanceSelect = this.instancesList.find(i => i.name == configClient?.instance_select);
        if (instanceSelect) {
            this.currentServerIndex = this.instancesList.indexOf(instanceSelect);
        } else if (this.instancesList.length > 0) {
            this.currentServerIndex = 0;
            // Auto select first
            configClient.instance_select = this.instancesList[0].name;
            await this.db.updateData('configClient', configClient);
        }

        this.updateCarouselUI();
    }

    async navigateServer(direction) {
        if (this.instancesList.length === 0) return;

        this.currentServerIndex += direction;

        // Loop navigation
        if (this.currentServerIndex < 0) {
            this.currentServerIndex = this.instancesList.length - 1;
        } else if (this.currentServerIndex >= this.instancesList.length) {
            this.currentServerIndex = 0;
        }

        let selectedInstance = this.instancesList[this.currentServerIndex];

        // Update Config
        let configClient = await this.db.readData('configClient');
        configClient.instance_select = selectedInstance.name;
        await this.db.updateData('configClient', configClient);

        this.updateCarouselUI();
    }

    async updateCarouselUI() {
        if (this.instancesList.length === 0) return;

        let instance = this.instancesList[this.currentServerIndex];

        // Update Text
        document.querySelector('.server-name-display').innerText = instance.name;
        document.querySelector('.server-status-display').innerText = "Chargement...";

        // Update Status
        setStatus(instance.status);

        // Update Background (Dynamic)
        // Try to load background from assets based on server name
        let backgroundUrl = `assets/images/backgrounds/${instance.name.toLowerCase().replace(/ /g, '_')}.jpg`;

        let body = document.querySelector('body');
        body.style.backgroundImage = `url('${backgroundUrl}')`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.transition = 'background-image 0.5s ease-in-out';

        // Update 3D Model Animation based on server (Optional fun feature)
        if (instance.name.toLowerCase().includes('pvp')) {
            this.skinViewer.animation = new skinview3d.RunningAnimation();
        } else {
            this.skinViewer.animation = new skinview3d.WalkingAnimation();
        }
    }

    async startGame() {
        let launch = new Launch()
        let configClient = await this.db.readData('configClient')
        let instance = await config.getInstanceList()
        let authenticator = await this.db.readData('accounts', configClient.account_selected)
        let options = instance.find(i => i.name == configClient.instance_select)

        if (!options) {
            let popupError = new popup();
            popupError.openPopup({
                title: 'Erreur',
                content: 'Aucun serveur sélectionné.',
                color: 'red',
                options: true
            });
            return;
        }

        let playInstanceBTN = document.querySelector('.play-instance')
        let infoStartingBOX = document.querySelector('.info-starting-game')
        let infoStarting = document.querySelector(".info-starting-game-text")
        let progressBar = document.querySelector('.progress-bar')

        let opt = {
            url: options.url,
            authenticator: authenticator,
            timeout: 10000,
            path: `${await appdata()}/${process.platform == 'darwin' ? this.config.dataDirectory : `.${this.config.dataDirectory}`}`,
            instance: options.name,
            version: options.loadder.minecraft_version,
            detached: configClient.launcher_config.closeLauncher == "close-all" ? false : true,
            downloadFileMultiple: configClient.launcher_config.download_multi,
            intelEnabledMac: configClient.launcher_config.intelEnabledMac,

            loader: {
                type: options.loadder.loadder_type,
                build: options.loadder.loadder_version,
                enable: options.loadder.loadder_type == 'none' ? false : true
            },

            verify: options.verify,

            ignored: [...options.ignored],

            java: {
                path: configClient.java_config.java_path,
            },

            JVM_ARGS: options.jvm_args ? options.jvm_args : [],
            GAME_ARGS: options.game_args ? options.game_args : [],

            screen: {
                width: configClient.game_config.screen_size.width,
                height: configClient.game_config.screen_size.height
            },

            memory: {
                min: `${configClient.java_config.java_memory.min * 1024}M`,
                max: `${configClient.java_config.java_memory.max * 1024}M`
            }
        }

        launch.Launch(opt);

        playInstanceBTN.style.display = "none"
        infoStartingBOX.style.display = "block"
        progressBar.style.display = "";
        ipcRenderer.send('main-window-progress-load')

        launch.on('extract', extract => {
            ipcRenderer.send('main-window-progress-load')
            console.log(extract);
        });

        launch.on('progress', (progress, size) => {
            infoStarting.innerHTML = `Téléchargement ${((progress / size) * 100).toFixed(0)}%`
            ipcRenderer.send('main-window-progress', { progress, size })
            progressBar.value = progress;
            progressBar.max = size;
        });

        launch.on('check', (progress, size) => {
            infoStarting.innerHTML = `Vérification ${((progress / size) * 100).toFixed(0)}%`
            ipcRenderer.send('main-window-progress', { progress, size })
            progressBar.value = progress;
            progressBar.max = size;
        });

        launch.on('estimated', (time) => {
            let hours = Math.floor(time / 3600);
            let minutes = Math.floor((time - hours * 3600) / 60);
            let seconds = Math.floor(time - hours * 3600 - minutes * 60);
            console.log(`${hours}h ${minutes}m ${seconds}s`);
        })

        launch.on('speed', (speed) => {
            console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
        })

        launch.on('patch', patch => {
            console.log(patch);
            ipcRenderer.send('main-window-progress-load')
            infoStarting.innerHTML = `Patch en cours...`
        });

        launch.on('data', (e) => {
            progressBar.style.display = "none"
            if (configClient.launcher_config.closeLauncher == 'close-launcher') {
                ipcRenderer.send("main-window-hide")
            };
            new logger('Minecraft', '#36b030');
            ipcRenderer.send('main-window-progress-load')
            infoStarting.innerHTML = `Demarrage en cours...`
            console.log(e);
        })

        launch.on('close', code => {
            if (configClient.launcher_config.closeLauncher == 'close-launcher') {
                ipcRenderer.send("main-window-show")
            };
            ipcRenderer.send('main-window-progress-reset')
            infoStartingBOX.style.display = "none"
            playInstanceBTN.style.display = "flex"
            infoStarting.innerHTML = `Vérification`
            new logger(pkg.name, '#7289da');
            console.log('Close');
        });

        launch.on('error', err => {
            let popupError = new popup()

            popupError.openPopup({
                title: 'Erreur',
                content: err.error,
                color: 'red',
                options: true
            })

            if (configClient.launcher_config.closeLauncher == 'close-launcher') {
                ipcRenderer.send("main-window-show")
            };
            ipcRenderer.send('main-window-progress-reset')
            infoStartingBOX.style.display = "none"
            playInstanceBTN.style.display = "flex"
            infoStarting.innerHTML = `Vérification`
            new logger(pkg.name, '#7289da');
            console.log(err);
        });
    }

    getdate(e) {
        let date = new Date(e)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let allMonth = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
        return { year: year, month: allMonth[month - 1], day: day }
    }
}
export default Home;
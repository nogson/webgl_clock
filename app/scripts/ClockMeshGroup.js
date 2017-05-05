class ClockMeshGroup {

    constructor(index) {

        // 秒のマテリアルに関するパラメータ
        this.MATERIAL_PARAMETER = {
            color: 0xF7D533,
            //specular: 0x999999,
            //shininess: 30
            //roughness: 0,
            metalness: 0.5,

        };

        //this.material = new THREE.MeshPhongMaterial(this.MATERIAL_PARAMETER);
        // this.geometry = new THREE.SphereGeometry(0.01, 10, 10);
        this.material = new THREE.MeshStandardMaterial(this.MATERIAL_PARAMETER);
        this.geometry = new THREE.BoxGeometry(0.015, 0.015, 0.015);
        this.index = index;
        this.meshGroup = new THREE.Group();
        this.clockMeshInstance = [];

    }

    create() {

        if (this.index % 5 === 0) {
            //「時」用のオブジェクト
            for (var i = 0; i < 100; i++) {
                let pos = {
                    x: this.getRandomPos(0.15),
                    y: this.getRandomPos(0.15),
                    z: this.getRandomPos(0.15)
                }
                let rotation = {
                    x: this.getRandomPos(360),
                    y: this.getRandomPos(360),
                    z: this.getRandomPos(360)
                }
                let clockMesh = new ClockMesh(pos, rotation, this.material, this.geometry);
                let mesh = clockMesh.create();
                this.meshGroup.add(mesh);

                //ClockMeshのインスタンスを格納
                this.clockMeshInstance[i] = clockMesh;
                //グループに追加
                this.meshGroup.add(mesh);
            }

        } else {
            //「秒,分」用のオブジェクト
            for (var i = 0; i < 15; i++) {
                let pos = {
                    x: this.getRandomPos(0.15),
                    y: this.getRandomPos(0.15),
                    z: this.getRandomPos(0.15)
                }
                let rotation = {
                    x: this.getRandomPos(360),
                    y: this.getRandomPos(360),
                    z: this.getRandomPos(360)
                }
                let clockMesh = new ClockMesh(pos, rotation, this.material, this.geometry);
                let mesh = clockMesh.create();

                //ClockMeshのインスタンスを格納
                this.clockMeshInstance[i] = clockMesh;
                //グループに追加
                this.meshGroup.add(mesh);
            }
        }

        //初期表示位置。アニメーションさせて中央に表示させる為
        this.meshGroup.position.x = 0;
        this.meshGroup.position.z = 0;
        this.meshGroup.position.y = this.index * -0.1 - 20;

        return this.meshGroup;
    }

    getRandomPos(randomNum) {
        let num = 0;
        num = Math.random() * randomNum - Math.random() * randomNum;

        return num;
    }

    startSecondAnimation() {
        for (let i = 0, j = this.clockMeshInstance.length; i < j; i++) {
            this.clockMeshInstance[i].startSecondAnimation();
        }
    }

    startMinuteAnimation() {
        for (let i = 0, j = this.clockMeshInstance.length; i < j; i++) {
            this.clockMeshInstance[i].startMinuteAnimation();
        }
    }
    stopMinuteAnimation() {
        for (let i = 0, j = this.clockMeshInstance.length; i < j; i++) {
            this.clockMeshInstance[i].stopMinuteAnimation();
        }
    }

    startHourAnimation() {
        for (let i = 0, j = this.clockMeshInstance.length; i < j; i++) {
            this.clockMeshInstance[i].startHourAnimation();
        }
    }

    stopHourAnimation() {
        for (let i = 0, j = this.clockMeshInstance.length; i < j; i++) {
            this.clockMeshInstance[i].stopHourAnimation();
        }
    }
}
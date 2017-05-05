class Particle {

    constructor() {

        //パーティクル用のテクスチャ
        this.MATERIAL_PARAMETER_PARTICLE = {
            color: 0xFFFFFF,
            map: new THREE.TextureLoader().load('./images/tx1.jpg'),
            transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 0
        }

        this.isShow = false;

        this.sprite;

    }

    create() {
        let spMaterial = new THREE.SpriteMaterial(this.MATERIAL_PARAMETER_PARTICLE);
        let currentSecond = this.getCurrentSecond();
        this.sprite = new THREE.Sprite(spMaterial);
        this.sprite.scale.set(0.15, 0.15, 0.15);
        this.sprite.position.y = Math.random() * 0.15 - Math.random() * 0.15;
        this.sprite.position.x = Math.cos(currentSecond) * 3 + Math.random() * 0.15 - Math.random() * 0.15;
        this.sprite.position.z = Math.sin(currentSecond) * 3 + Math.random() * 0.15 - Math.random() * 0.15;
        this.render();
        return this.sprite;

    }

    render() {

        if (this.sprite.material.opacity >= 1) {
            this.isShow = true;
        }

        if (this.isShow === false) {
            this.show();
        } else {
            this.hide();
        }

        requestAnimationFrame(this.render.bind(this));
    }

    show() {
        this.sprite.material.opacity += 0.05;
    }

    hide() {
        this.sprite.material.opacity -= 0.05;
    }

    getCurrentSecond() {
        let currentTime = new Date().getMilliseconds();
        let currentSecond = Math.floor(currentTime / (1000 / 60)); //現在の秒数

        return currentSecond;
    }
}
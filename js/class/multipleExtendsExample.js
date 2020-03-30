
import { multipleExtends } from "./multipleExtends.js";


class a {
    get aaa () {
        return {
            a: this.aa
        }
    }

    constructor () {
        this.a = 2;
    }

    aa() {
        console.log(this.z);
        console.log(this.a);
    }
}

class b {
    get bbb () {
        return {
            b: this.bb
        }
    }

    constructor () {
        this.b = 3;
    }

    bb() {
        console.log(this.z);
        console.log(this.b);
    }
}

class c {
    constructor () {
        this.c = 44;
    }

    cc() {
        console.log(this.z);
        console.log(this.c);
    }
}

const D = multipleExtends(a, b, c, class {
    constructor() {
        console.log(`base`);
        this.z = 5
    }

    get m () {
        return {
            ...this.aaa,
            ...this.bbb,
        }
    }
});


const d = new D();
d.aa();
d.bb();
d.cc();

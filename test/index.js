const Tast = require('../lib/index').default;

Tast.push((finsh) => {
    console.log(1);
    setTimeout(finsh, 1000);
});

Tast.push((finsh) => {
    console.log(2);
    setTimeout(finsh, 1000);
});

Tast.push({
    abort(type) {
        console.log(type);
    },
    success (finish) {
        console.log(3);
        setTimeout(finish, 16000);
    }
})

Tast.push({
    abort(type) {
        console.log(type);
    },
    success (finish) {
        console.log(4);
    }
}).abort();

Tast.push((finsh) => {
    console.log(5);
    setTimeout(finsh, 1000);
});
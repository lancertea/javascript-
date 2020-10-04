## class
ES6：
```javascript
class People {
    constructor(name) {
        this.name = name;
    }
    eat() {
        return this.name + ' eating';
    }
    static sleep() {
        return this.name + ' go to sleep';
    }
}

class Student extends People {
    constructor(name, id) {
        super(name);
        this.id = id;
    }
    eatMore() {
        console.log(super.eat());
    }
}
var s = new Student('zzz', 101);
s.eatMore();
console.log(Student.sleep());
```
ES5:
```javascript
function People(name) {
    this.name = name;
}

People.prototype.eat = function () {
    return this.name + ' eating';
}

People.sleep = function () {
    return this.name + ' go to sleep';
}

function Student(name, id) {
    People.call(this, name);
    this.id = id;
}

Student.prototype = Object.create(People.prototype);
Student.prototype.constructor = Student;

Student.prototype.eatMore = function () {
    console.log(People.prototype.eat.call(this));
}

Student.__proto__ = People;

var s = new Student('zzz', 101);
s.eatMore();
console.log(Student.sleep());
```

class Boy {
  @speak('中文')
  run () {
    console.log('I can speak ' + this.language)
    console.log('I can run!')
  }
}

/**
 * 这里是真正的 decorator
 * @target 装饰的属性所述的类的原型，注意，不是实例后的类。如果装饰的是 Boy 的某个属性，这个 target 的值就是 Boy.prototype
 * @name 装饰的属性的 key
 * @descriptor 装饰的对象的描述对象
 */
// function speak (target, key, descriptor) {
//   console.log(target)
//   console.log(key)
//   console.log(descriptor)
// }

function speak (language) {
  return function (target, key, descriptor) {
    console.log(target)
    console.log(key)
    console.log(descriptor)

    target.language = language

    return descriptor
  }
}


const Luke = new Boy()

Luke.run()
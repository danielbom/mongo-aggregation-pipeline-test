const faker = require('faker');
const { factory } = require('factory-girl');
const models = require('./models');

factory.define('User', models.User, {
  username: faker.name.findName(),
});

factory.define('People', models.People, {
  name: faker.name.findName(),
  age: faker.random.number(50),
  async user_id() {
    const user = await factory.create('User');
    return user._id;
  }
});

factory.define('Contact', models.Contact, {
  phone: faker.phone.phoneNumber(),
  email: faker.internet.email,
  async user_id() {
    const [user] = await models.User.aggregate([{ $sample: { size: 1 } }]);
    if (!user) throw Error("Contact Factory broken");
    return user._id;
  }
});

module.exports = factory
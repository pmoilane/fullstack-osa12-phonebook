db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'phone_database',
    },
  ],
});

db.createCollection('people');

db.people.insert({ name: 'Kauppa Kalle', number: '050-1234123' });
db.people.insert({ name: 'Sauna Sami', number: '040-3453456' });

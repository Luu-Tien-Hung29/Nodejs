const dbConfig = {
  HOST: "125.212.238.157",
  USER: "kingofbet",
  PASSWORD: "Kingbet123#",
  DB: "kingofbet_crawler",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default dbConfig;

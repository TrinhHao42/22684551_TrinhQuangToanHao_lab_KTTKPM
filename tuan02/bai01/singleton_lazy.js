class Counter {
  constructor() {
    this.count = 0;
    console.log("🆕 LazySingleton CREATED");
  }

  async increase() {
    await new Promise((r) => setTimeout(r, 300));
    this.count++;
    console.log("LazySingleton -> count =", this.count);
  }
}

let instance = null;

async function getInstance() {
  if (!instance) {
    instance = new Counter();
  }
  return instance;
}

(async () => {
  console.log("\n===== LAZY SINGLETON =====");

  const a = await getInstance();
  await a.increase();

  const b = await getInstance();
  await b.increase();

  const c = await getInstance();
  await c.increase();

  console.log("\nSame instance?", a === b);
})();

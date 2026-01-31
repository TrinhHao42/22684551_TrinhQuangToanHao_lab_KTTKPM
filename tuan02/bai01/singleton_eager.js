class Counter {
  constructor(label) {
    this.label = label;
    this.count = 0;
    console.log(`🆕 ${label} CREATED`);
  }

  async increase() {
    await new Promise((r) => setTimeout(r, 300));
    this.count++;
    console.log(`${this.label} -> count = ${this.count}`);
  }
}

(async () => {
  console.log("\n===== EAGER SINGLETON (SAVE INSTANCE) =====");

  const eagerSingleton = new Counter("EagerSingleton");

  await eagerSingleton.increase();
  await eagerSingleton.increase();
  await eagerSingleton.increase();

  console.log("\n===== EAGER (DON'T SAVE INSTANCE) =====");

  const a = new Counter("Instance A");
  await a.increase();

  const b = new Counter("Instance B");
  await b.increase();

  const c = new Counter("Instance C");
  await c.increase();

  console.log("\nSame instance?", a === b);
})();

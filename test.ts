import { V7Generator } from "uuidv7";

const generator = new V7Generator();

console.log(generator.generate().toString());
// Copied from semaphore/semaphorejs/src/util/index.js
// @ts-ignore
import * as snarkjs from "snarkjs";
import * as assert from "assert";
import bigInt = require("big-integer");
import { SnarkProof } from "../@types";

const unstringifyBigInts = (o: any): any => {
  if (typeof o == "string" && /^[0-9]+$/.test(o)) {
    return bigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
    const res: any = {};
    for (const k in o) {
      res[k] = unstringifyBigInts(o[k]);
    }
    return res;
  } else {
    return o;
  }
};

const writeUint32 = (
  h: {
    dataView: { setUint32: (arg0: any, arg1: any, arg2: boolean) => void };
    offset: number;
  },
  val: any
) => {
  h.dataView.setUint32(h.offset, val, true);
  h.offset += 4;
};

const writeBigInt = (h: any, bi: any) => {
  for (let i = 0; i < 8; i++) {
    const v = bi
      .shiftRight(i * 32)
      .and(0xffffffff)
      .toJSNumber();
    writeUint32(h, v);
  }
};

const calculateBuffLen = (witness: string | any[]): number => {
  let size = 0;

  // beta2, delta2
  size += witness.length * 32;

  return size;
};

const convertWitness = (witnessJson: string | any[]): Buffer => {
  const witness = unstringifyBigInts(witnessJson);
  const buffLen = calculateBuffLen(witness);

  const buff = new ArrayBuffer(buffLen);

  const h = {
    dataView: new DataView(buff),
    offset: 0,
  };

  for (let i = 0; i < witness.length; i++) {
    writeBigInt(h, witness[i]);
  }

  assert.equal(h.offset, buffLen);

  return Buffer.from(buff);
};

// @ts-ignore
import buildGroth16 = require("websnark/src/bn128.js");

const prove = async (
  witness: ArrayBuffer,
  provingKey: ArrayBuffer
): Promise<SnarkProof> => {
  const groth16 = await buildGroth16();
  const p = await groth16.groth16GenProof(witness, provingKey);
  await groth16.terminate();
  return snarkjs.unstringifyBigInts(p);
};

const cutDownBits = (b: snarkjs.bigInt, bits: number): snarkjs.bigInt => {
  let mask = snarkjs.bigInt(1);
  mask = mask.shl(bits).sub(snarkjs.bigInt(1));
  return b.and(mask);
};

const beBuff2int = (buff: snarkjs.bigInt): snarkjs.bigInt => {
  let res = snarkjs.bigInt.zero;
  for (let i = 0; i < buff.length; i++) {
    const n = snarkjs.bigInt(buff[buff.length - i - 1]);
    res = res.add(n.shl(i * 8));
  }
  return res;
};

export { convertWitness, prove, cutDownBits, beBuff2int };

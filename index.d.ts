import * as snarkjs from 'snarkjs'
import { tree } from 'semaphore-merkle-tree'

type SnarkBigInt = snarkjs.bigInt
type EddsaPrivateKey = Buffer
type EddsaPublicKey = SnarkBigInt[]
type SnarkCircuit = snarkjs.Circuit
type SnarkProvingKey = Buffer
type SnarkVerifyingKey = Buffer
type SnarkWitness = Array<SnarkBigInt>
type SnarkPublicSignals = SnarkBigInt[]

interface WitnessData {
    witness: any,
    signal: string,
    signalHash: SnarkBigInt,
    signature: EdDSASignature,
    msg: SnarkBigInt,
    tree: tree.MerkleTree,
    identityPath: any,
    identityPathIndex: any,
    identityPathElements: any,
}

interface EddsaKeyPair {
    pubKey: EddsaPublicKey,
    privKey: EddsaPrivateKey,
}

interface Identity {
    keypair: EddsaKeyPair,
    identityNullifier: SnarkBigInt,
    identityTrapdoor: SnarkBigInt,
}

interface SnarkProof {
    pi_a: SnarkBigInt[]
    pi_b: SnarkBigInt[][]
    pi_c: SnarkBigInt[]
}

interface EdDSASignature {
    R8: SnarkBigInt[],
    S: SnarkBigInt,
}

interface BroadcastSignalParams {
    signal: Uint8Array;
    proof: any;
    root: any;
    nullifiersHash: any;
    externalNullifier: any;
  }

export {
    Identity,
    EddsaKeyPair,
    EddsaPrivateKey,
    EddsaPublicKey,
    EdDSASignature,
    SnarkCircuit,
    SnarkProvingKey,
    SnarkVerifyingKey ,
    SnarkWitness,
    SnarkPublicSignals,
    SnarkProof,
    SnarkBigInt,
    WitnessData,
    BroadcastSignalParams,
}

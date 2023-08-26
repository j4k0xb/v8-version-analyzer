function hashValueUnsigned(v) {
  v = ((v << 15n) - v - 1n) & 0xffffffffn;
  v = (v ^ (v >> 12n)) & 0xffffffffn;
  v = (v + (v << 2n)) & 0xffffffffn;
  v = (v ^ (v >> 4n)) & 0xffffffffn;
  v = (v * 2057n) & 0xffffffffn;
  v = (v ^ (v >> 16n)) & 0xffffffffn;
  return v;
}

function hashCombine64(seed, value) {
  const m = 0xc6a4a7935bd1e995n;
  const r = 47n;

  value = (value * m) & 0xffffffffffffffffn;
  value = (value ^ (value >> r)) & 0xffffffffffffffffn;
  value = (value * m) & 0xffffffffffffffffn;

  seed = (seed ^ value) & 0xffffffffffffffffn;
  seed = (seed * m) & 0xffffffffffffffffn;
  return seed;
}

export function versionHash64(major, minor, build, patch = 0) {
  let seed = 0n;
  seed = hashCombine64(seed, hashValueUnsigned(BigInt(patch)));
  seed = hashCombine64(seed, hashValueUnsigned(BigInt(build)));
  seed = hashCombine64(seed, hashValueUnsigned(BigInt(minor)));
  seed = hashCombine64(seed, hashValueUnsigned(BigInt(major)));
  return Number(seed & 0xffffffffn);
}

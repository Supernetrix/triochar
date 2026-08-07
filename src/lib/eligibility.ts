const canonicalEligibilityOrder = ["CORSIA", "CRCF", "Article 6", "CCP"] as const;

const eligibilityRank = new Map<string, number>(
  canonicalEligibilityOrder.map((value, index) => [value, index]),
);

export function sortEligibilityValues(values: string[]) {
  return values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => {
      const leftRank = eligibilityRank.get(left.value) ?? Number.MAX_SAFE_INTEGER;
      const rightRank = eligibilityRank.get(right.value) ?? Number.MAX_SAFE_INTEGER;

      return leftRank - rightRank || left.index - right.index;
    })
    .map(({ value }) => value);
}



interface BiconomyFeeMode {
  option: "auto" | "gasless" | "custom";
  feeQuote?: any; 
}

function auto(): BiconomyFeeMode {
  return { option: "auto" };
}

function gasless(): BiconomyFeeMode {
  return { option: "gasless" };
}

function custom(feeQuote: any): BiconomyFeeMode {
  return { option: "custom", feeQuote };
}


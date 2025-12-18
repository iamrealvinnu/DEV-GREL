document.addEventListener("DOMContentLoaded", function () {

  const calculateBtn = document.getElementById("calculateEmi");

  calculateBtn.addEventListener("click", function () {

    const loanAmount = parseFloat(document.getElementById("loanAmount").value);
    const annualRate = parseFloat(document.getElementById("interestRate").value);
    const tenureYears = parseFloat(document.getElementById("loanTenure").value);

    if (!loanAmount || !annualRate || !tenureYears) {
      alert("Please enter valid loan details");
      return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    document.getElementById("emiResult").innerText =
      emi.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  });

});

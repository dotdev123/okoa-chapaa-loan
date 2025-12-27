import React, { useState, useEffect } from 'react';

const SecureLoans = ({ onBack }) => {
  const [userData, setUserData] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loanTrackingId, setLoanTrackingId] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('okoaChapaaUser') || '{}');

    // Generate Loan Tracking ID once and save it
    if (!stored.loanTrackingId) {
      const newId = 'OKC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      stored.loanTrackingId = newId;
      localStorage.setItem('okoaChapaaUser', JSON.stringify(stored));
      setLoanTrackingId(newId);
    } else {
      setLoanTrackingId(stored.loanTrackingId);
    }

    setUserData(stored);
    setPhoneNumber(stored.mpesaPhone || '');
  }, []);

  const handlePaySecurityFee = () => {
    // In real app: trigger M-Pesa STK push or payment flow
    alert(`Initiating payment of KES ${userData.securityFee || userData.fee || 0} to secure your loan.\nYou will receive an M-Pesa prompt shortly.`);
  };

  if (!userData.firstName) {
    return <div className="text-center pt-28">Loading your loan details...</div>;
  }

  return (
    <section className="pt-28 pb-20 min-h-screen bg-gradient-to-b from-background to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={onBack}
          className="mb-8 text-primary hover:text-secondary font-medium flex items-center gap-2 text-base sm:text-lg"
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <i className="fas fa-shield-alt text-8xl sm:text-9xl text-secondary mb-6"></i>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Secure Your Loan
            </h2>
            <p className="text-lg sm:text-xl text-gray-700">
              Hello <strong>{userData.firstName}</strong>, complete the final step to receive your funds instantly.
            </p>
          </div>

          {/* User Info Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 mb-12">
            <table className="w-full text-left">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-semibold text-gray-800 bg-gray-50">Full Name</td>
                  <td className="py-4 px-6">{userData.fullName || '-'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-semibold text-gray-800 bg-gray-50">National ID</td>
                  <td className="py-4 px-6">{userData.idNumber || '-'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-semibold text-gray-800 bg-gray-50">County</td>
                  <td className="py-4 px-6">{userData.county || '-'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-semibold text-gray-800 bg-gray-50">Monthly Income Range</td>
                  <td className="py-4 px-6">{userData.monthlyIncomeRange || '-'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-semibold text-gray-800 bg-gray-50">Loan Purpose</td>
                  <td className="py-4 px-6">{userData.loanPurpose || '-'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-semibold text-gray-800 bg-gray-50">Loan Amount</td>
                  <td className="py-4 px-6 font-bold text-primary text-xl">
                    KES {(userData.requestedAmount || userData.amount || 0).toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-semibold text-gray-800 bg-gray-50">Security Fee</td>
                  <td className="py-4 px-6 font-bold text-primary text-xl">
                    KES {(userData.securityFee || userData.fee || 0).toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-semibold text-gray-800 bg-gray-50">Total to Repay</td>
                  <td className="py-4 px-6 font-bold text-2xl text-primary">
                    KES {(userData.totalRepay || 0).toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 font-semibold text-gray-800 bg-gray-50">Repayment Period</td>
                  <td className="py-4 px-6">60 days</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-gray-800 bg-gray-50">Loan Tracking ID</td>
                  <td className="py-4 px-6 font-mono font-bold text-secondary text-lg">
                    {loanTrackingId}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pay Security Fee Card */}
          <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-3xl p-8 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
              Pay Security Fee to Activate Loan
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              Enter your M-Pesa number below and pay the security fee to receive your loan instantly.
            </p>

            <div className="max-w-md mx-auto mb-8">
              <label className="block text-left text-base sm:text-lg font-semibold text-gray-800 mb-3">
                M-Pesa Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-6 py-5 rounded-l-2xl border border-r-0 border-gray-300 bg-gray-50 text-gray-700 text-base sm:text-lg font-medium">
                  +254
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  maxLength="9"
                  className="w-full px-6 py-5 text-base sm:text-lg border border-gray-300 rounded-r-2xl focus:outline-none focus:ring-4 focus:ring-secondary/30"
                  placeholder="712345678"
                />
              </div>
            </div>

            <button
              onClick={handlePaySecurityFee}
              disabled={phoneNumber.length !== 9}
              className="w-full max-w-md mx-auto btn-primary text-lg sm:text-xl py-6 rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Pay Security Fee & Receive Loan
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              You will receive an M-Pesa prompt to pay KES {userData.securityFee || userData.fee || 0}.<br />
              Once paid, your loan will be sent immediately.
            </p>
          </div>

          {/* Final Reassurance */}
          <div className="mt-12 text-center space-y-4">
            <p className="text-gray-700">
              <i className="fas fa-lock text-secondary mr-2"></i>
              Your data is encrypted and secure
            </p>
            <p className="text-gray-700">
              <i className="fas fa-headset text-secondary mr-2"></i>
              Support available 24/7 — contact us anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecureLoans;
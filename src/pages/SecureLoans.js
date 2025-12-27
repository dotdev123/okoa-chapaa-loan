import React, { useState, useEffect } from 'react';

const SecureLoans = ({ onBack }) => {
  const [userData, setUserData] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loanTrackingId, setLoanTrackingId] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(''); // 'pending', 'success', 'failed', 'cancelled'
  const [clientReference, setClientReference] = useState('');

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

  // Polling for payment status
  useEffect(() => {
    if (!clientReference || paymentStatus) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/status?reference=${clientReference}`);
        const data = await res.json();

        if (data.success) {
          if (data.status === 'SUCCESS') {
            setPaymentStatus('success');
            clearInterval(interval);
          } else if (data.status === 'FAILED' || data.status === 'CANCELLED') {
            setPaymentStatus(data.status.toLowerCase());
            clearInterval(interval);
          }
          // else continue polling (QUEUED/PENDING)
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [clientReference, paymentStatus]);

  const handlePaySecurityFee = async () => {
    if (phoneNumber.length !== 9 || isPaying) return;

    setIsPaying(true);
    setPaymentStatus('pending');

    // Generate client reference
    const ref = `OKC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setClientReference(ref);

    try {
      const res = await fetch('/api/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: `0${phoneNumber}`, // Send as 07xx format
          amount: userData.securityFee || userData.fee || 0,
          reference: ref,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('STK Push sent! Please check your phone and complete the payment.');
      } else {
        alert(`Payment initiation failed: ${data.error || 'Unknown error'}`);
        setIsPaying(false);
        setPaymentStatus('');
        setClientReference('');
      }
    } catch (err) {
      alert('Network error. Please try again.');
      setIsPaying(false);
      setPaymentStatus('');
      setClientReference('');
    }
  };

  if (!userData.firstName) {
    return <div className="text-center pt-28 text-lg">Loading your loan details...</div>;
  }

  const securityFee = userData.securityFee || userData.fee || 0;

  return (
    <section className="pt-20 pb-20 min-h-screen bg-gradient-to-b from-background to-white">
      <div className="max-w-md mx-auto px-4">
        <button
          onClick={onBack}
          className="mb-6 text-primary hover:text-secondary font-medium flex items-center gap-2 text-base"
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <i className="fas fa-shield-alt text-6xl sm:text-7xl text-secondary mb-4"></i>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
              Secure Your Loan
            </h2>
            <p className="text-base sm:text-lg text-gray-700">
              Hello <strong>{userData.firstName}</strong>,<br />
              complete the final step to receive your funds instantly.
            </p>
          </div>

          {/* User Info List */}
          <div className="space-y-4 mb-10">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-semibold text-lg">{userData.fullName || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">National ID</p>
              <p className="font-semibold text-lg">{userData.idNumber || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">County</p>
              <p className="font-semibold text-lg">{userData.county || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">Monthly Income Range</p>
              <p className="font-semibold text-lg">{userData.monthlyIncomeRange || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">Loan Purpose</p>
              <p className="font-semibold text-lg">{userData.loanPurpose || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">Loan Amount</p>
              <p className="font-bold text-primary text-2xl">
                KES {(userData.requestedAmount || userData.amount || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">Security Fee</p>
              <p className="font-bold text-primary text-2xl">
                KES {securityFee.toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl p-5">
              <p className="text-sm text-gray-600">Total to Repay</p>
              <p className="font-bold text-primary text-3xl">
                KES {(userData.totalRepay || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">Repayment Period</p>
              <p className="font-semibold text-lg">60 days</p>
            </div>
            <div className="bg-secondary/10 rounded-2xl p-4">
              <p className="text-sm text-gray-600">Loan Tracking ID</p>
              <p className="font-mono font-bold text-secondary text-xl">{loanTrackingId}</p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-3xl p-6 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4">
              Pay Security Fee to Activate Loan
            </h3>
            <p className="text-base text-gray-700 mb-6">
              Enter your M-Pesa number and complete payment to receive your loan.
            </p>

            <div className="mb-8">
              <label className="block text-left text-base font-semibold text-gray-800 mb-2">
                M-Pesa Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-5 py-4 rounded-l-2xl border border-r-0 border-gray-300 bg-gray-50 text-gray-700 text-base font-medium">
                  +254
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  maxLength="9"
                  disabled={isPaying || paymentStatus === 'success'}
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-r-2xl focus:outline-none focus:ring-4 focus:ring-secondary/30 disabled:bg-gray-100"
                  placeholder="712345678"
                />
              </div>
            </div>

            {/* Payment Status Messages */}
            {paymentStatus === 'pending' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                <p className="text-yellow-800 flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  Waiting for payment confirmation...
                </p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-2xl">
                <p className="text-green-800 font-bold text-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  Payment Successful! Your loan has been secured and approved.
                </p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-2xl">
                <p className="text-red-800 font-bold text-center">
                  Payment failed. Please try again.
                </p>
              </div>
            )}

            {paymentStatus === 'cancelled' && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-300 rounded-2xl">
                <p className="text-orange-800 font-bold text-center">
                  Payment was cancelled. You can try again.
                </p>
              </div>
            )}

            <button
              onClick={handlePaySecurityFee}
              disabled={phoneNumber.length !== 9 || isPaying || paymentStatus === 'success'}
              className="w-full btn-primary text-lg py-5 rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed relative"
            >
              {isPaying ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-3"></i>
                  Sending STK Push...
                </>
              ) : paymentStatus === 'success' ? (
                'Payment Completed'
              ) : (
                `Pay KES ${securityFee.toLocaleString()} Security Fee`
              )}
            </button>

            <p className="text-xs sm:text-sm text-gray-600 mt-5">
              You will receive an M-Pesa prompt to pay KES {securityFee.toLocaleString()}.<br />
              Once paid, your loan will be secured and approved.
            </p>
          </div>

          {/* Reassurance */}
          <div className="mt-10 space-y-4 text-center">
            <p className="text-gray-700 flex items-center justify-center gap-3">
              <i className="fas fa-lock text-secondary text-xl"></i>
              <span className="text-base">Your data is encrypted and secure</span>
            </p>
            <p className="text-gray-700 flex items-center justify-center gap-3">
              <i className="fas fa-headset text-secondary text-xl"></i>
              <span className="text-base">Support available 24/7</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecureLoans;
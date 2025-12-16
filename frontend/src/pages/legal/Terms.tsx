import React from 'react';
import LegalLayout from '../../components/layout/LegalLayout';

const Terms: React.FC = () => {
    return (
        <LegalLayout title="Terms of Service">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Introduction</h2>
            <p>Welcome to Ersen ("we," "our," or "us"). By accessing or using our website, services, and tools (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms").</p>

            <h2>2. Account Terms</h2>
            <p>You must be a human. Accounts registered by "bots" or other automated methods are not permitted. You must provide your legal full name, a valid email address, and any other information requested in order to complete the signup process.</p>
            <p>You are responsible for maintaining the security of your account and password. We cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>

            <h2>3. Payment, Refunds, Upgrading and Downgrading Terms</h2>
            <p>A valid credit card is required for paying accounts. Free accounts are not required to provide a credit card number.</p>
            <p>The Service is billed in advance on a monthly or yearly basis and is non-refundable. There will be no refunds or credits for partial months of service, upgrade/downgrade refunds, or refunds for months unused with an open account.</p>

            <h2>4. Cancellation and Termination</h2>
            <p>You are solely responsible for properly canceling your account. You can cancel your account at any time by clicking on the Settings link in the global navigation bar at the top of the screen. The Account screen provides a simple no-questions-asked cancellation link.</p>

            <h2>5. Copyright and Content Ownership</h2>
            <p>We claim no intellectual property rights over the material you provide to the Service. Your profile and materials uploaded remain yours.</p>

            <h2>6. General Conditions</h2>
            <p>Your use of the Service is at your sole risk. The service is provided on an "as is" and "as available" basis.</p>
            <p>You understand that we use third-party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Service.</p>
        </LegalLayout>
    );
};

export default Terms;

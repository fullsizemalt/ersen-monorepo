import React from 'react';
import LegalLayout from '../../components/layout/LegalLayout';

const Privacy: React.FC = () => {
    return (
        <LegalLayout title="Privacy Policy">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us. For example, we collect information when you create an account, subscribe to our newsletter, or communicate with us. The types of information we may collect include your name, email address, payment information, and any other information you choose to provide.</p>

            <h2>2. How We Use Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, such as to administer your account, process web payments, and send you technical notices, updates, security alerts, and support and administrative messages.</p>

            <h2>3. Data Storage</h2>
            <p>We use third-party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run Ersen. Although we own the code, databases, and all rights to the Ersen application, you retain all rights to your data.</p>

            <h2>4. Cookies</h2>
            <p>We use cookies to authenticate your session and provide essential functionality. We do not use third-party tracking cookies for advertising purposes.</p>

            <h2>5. Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>

            <h2>6. Changes to this Policy</h2>
            <p>We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy.</p>
        </LegalLayout>
    );
};

export default Privacy;

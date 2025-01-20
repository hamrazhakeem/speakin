import React from 'react';
import Layout from '../../../components/user/common/layout/Layout';
import StripeRefreshContent from '../../../components/user/sharedpages/withdraw/StripeRefreshContent';

const StripeRefresh = () => {
  return (
    <Layout>
      <StripeRefreshContent />
    </Layout>
  );
};

export default StripeRefresh;
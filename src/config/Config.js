let routes = {
    base: 'http://demo.easygaadi.com/v1',
    //base: 'http://erp.easygaadi.com/v1',
    loginRoute: '/group/login',
    easygaadiDashBroad: '/admin/erpDashboard',
    totalRevenueByVechicle:'/trips/find/revenueByVehicle',
    detailsRevenueFromVechicle:'/party/vehiclePayments/',
    totalExpensesForAllVehicles:'/expense/groupByVehicle',
    detailsExpensesForAllVehicles:'/expense/vehicleExpense/',
    totalPaymentFromParty: '/payments/getDuesByParty/',
    totalPaymentByParty: '/party/tripsPayments/',

    //expiry
    permitExpiryTrucks: '/trucks/permitExpiryTrucks/',
    insuranceExpiryTrucks: '/trucks/insuranceExpiryTrucks/',
    pollutionExpiryTrucks: '/trucks/pollutionExpiryTrucks/',
    taxExpiryTrucks: '/trucks/taxExpiryTrucks/',
    fitnessExpiryTrucks: '/trucks/fitnessExpiryTrucks/',

    //Driver Module
    addDriver: '/drivers',
    driverList : '/drivers/account/drivers',
    partyList : '/party/get/all',
    trucksList : '/trucks/groupTrucks',
    paymentList : '/payments/getPayments',


    communitiesRoute: '/v1/user/communities',
    otpRoute: '/v1/user/forgot',
    setPasswordRoute: '/v1/user/reset',
    signUpRoute: '/v1/user/sign-up',
    verifyOtpRoute: '/v1/user/verify',
    basketRoute: '/v1/user/baskets',
    addressRoute: '/v1/user/save/address',
    orderOtpRoute: '/v1/user/order/otp/generate', // send otp to client
    verifyMobileRoute: '/v1/user/order/otp/verify', // verify otp of client
    addGuestUserData: '/v1/user/order/capture',
    saveRazorPayDetails: '/v1/user/order/razorpay/capture',
    savePaytmDetails: '/v1/user/order/paytm/capture',
    getOrderDetails: '/v1/user/order/fetch', // get orders in start subscription
    cancelOrders: '/v1/user/order/cancel',
    locationRoute: '/v1/user/verify/location/',
    enquiryRoute: '/v1/user/enquiries/save',

    fetchRoute: '/v1/user/order/fetch',
    getSearchLocations: '/v1/user/communities/fetch', // to fetch maps
    getBasketsAll: '/v1/user/baskets/all', // to fetch all basket types: small,medium...
    getBasketItems: '/v1/user/products/', // get items for selected tab

    updateRoute: '/v1/user/order/update',
    updateOrderDetails: '/v1/user/order/update',
    updateOrderPauseDates: '/v1/user/order/pause',
    signOtpVerifyRoute: '/v1/user/signin/otp/verify',
    bannersFetch: '/v1/user/banners/fetch',

};

let limiters = {
    userNameLength: 4,
    mobileLength: 10,
    passwordLength: 8,
    otpLength: 6
};

export default {routes, limiters};
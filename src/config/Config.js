let routes = {
   base: 'http://demoerp.easygaadi.com/v1',getProfilePic:'http://demoerp.easygaadi.com/images/profile-pics/',
   // base: 'http://erp.easygaadi.com/v1',getProfilePic:'http://erp.easygaadi.com/images/profile-pics/',
    // base: 'http://192.168.1.76:3000/v1',getProfilePic:'http://192.168.1.76:3000/images/profile-pics/',
   



    loginRoute: '/group/login',
    easygaadiDashBroad: '/admin/erpDashboard',
    erpSettingData:'/admin/getErpSettings',
    updateErpSettingData:'/admin/updateErpSettings',
    totalRevenueByVechicle:'/trips/find/revenueByVehicle?fromDate=&page=&regNumber=&size=&sort={"createdAt":-1}&toDate=',
    detailsRevenueFromVechicle:'/party/vehiclePayments/',
    totalExpensesForAllVehicles:'/expense/groupByVehicle?fromDate=&page=&regNumber=&size=&sort={"createdAt":-1}&toDate=',
    detailsExpensesForAllVehicles:'/expense/vehicleExpense/',
    totalPaymentFromParty: '/payments/getDuesByParty?fromDate=&page=&regNumber=&size=&sort={"createdAt":-1}&toDate=',
    totalPaymentByParty: '/party/tripsPayments/',

    //filter with date,vechile
    filterTotalRevenueByVechicle:'/trips/find/revenueByVehicle?',
    filterTotalExpensesForAllVehicles:'/expense/groupByVehicle?',
    filterTotalPaymentFromParty: '/payments/getDuesByParty?',
    totalPayeblesPayment:'/expense/getPaybleAmountByParty?fromDate=&page=&regNumber=&size=&sort={"createdAt":-1}&toDate=',
    totalPayablesPaymentByParty: '/expense/getPaybleAmountByPartyId?partyId=',
    filterTotalPayeblesPayment:'/expense/getPaybleAmountByParty?',

    //downloadReports
    downloadRevenue:'/trips/downloadRevenueDetailsByVechicle?',

    //expiry
    permitExpiryTrucks: '/trucks/permitExpiryTrucks/',
    insuranceExpiryTrucks: '/trucks/insuranceExpiryTrucks/',
    pollutionExpiryTrucks: '/trucks/pollutionExpiryTrucks/',
    taxExpiryTrucks: '/trucks/taxExpiryTrucks/',
    fitnessExpiryTrucks: '/trucks/fitnessExpiryTrucks/',

    //Driver Module,edit(GET--drivers/get/id)
    addDriver: '/drivers',
    getDriverInfo:'/drivers/get/',
    
    driverList : '/drivers/account/drivers',
    //partyList : '/party/get/all',
    partyList : '/party/get/accountParties',
    trucksList : '/trucks/groupTrucks',
    paymentList : '/payments/getPayments',
    ExpensesList : '/expense/getAllExpenses',
    tripsList : '/trips/getAllAccountTrips',
    //Forgot-password
    forgotPassword:'/group/forgot-password',
    //otp vERIFICATION
    OtpVerfication:'/group/verify-otp',

    //Payments api
    addPayment:'/payments/addPayments',
    editPayment:'/payments/getPaymentsRecord/',
    updatePayment:'/payments/updatePayments/',
    getpartyTrip:'/trips/getPartiesByTrips',

    //trucks api--add ,edit(GET--trucks/id)
    addtrucksList : '/trucks/',
    getTruckTypes:'/trucks/getTruckTypes',

    //party api--add ,edit(GET--party/id)
    addParty : '/party/addParty',
    getPartyDetails:'/party/',
    updatePartyDetails:'/party/updateParty',
    //Trip -api--add,edit(GET--trips/id)
    addTrip:'/trips/addTrip',
    getTripsDetails:'/trips/',

    //expenseType
    getExpensesType:'/expenseMaster',
    getAllSupplier:'/party/getAllPartiesBySupplier',
    addExpense:'/expense/addExpense',
    updateExpenseDetails:'/expense/updateExpense',
    getExpenseDetails:'/expense/getExpense/',


    //Add Group
    addGroup:'/admin/addAccountGroup',
    getListofGroups:'/admin/getAllAccountGroup',
    getGroupDetails:'/admin/getAccountGroup/',
    updateGroupGroup:'/admin/updateAccountGroup',


    //mail
    revenueMail:'/trips/shareRevenueDetailsByVechicleViaEmail?',
    expenseMail:'/expense/shareExpensesDetailsViaEmail?',
    paymentsMail:'/expense/sharePayableDetailsViaEmail?',
    receivablesMail:'/payments/sharePaymentsDetailsByPartyViaEmail?',
    expiryTrucksMail:'/trucks/shareExpiredDetailsViaEmail?',
    
    //GPS-module
    gpsTruckList:'/trucks/groupTrucks/?page=1&size=10&sort=%7B%22createdAt%22:-1%7D',
    gpsTrackLocation:'/gps/gpsTrackingByTruck',
    gpsTrackingByMapView:'/gps/gpsTrackingByMapView',
    getTruckReport:'/gps/getTruckReport/',
    unCheckLookingForLoad:'/trucks/unCheckLookingForLoad',

    //Profile
    getProfileDetails:'/admin/userProfile',
    updateProfile:'/admin/accounts/update',
    uploadProfilePic:'/admin/uploadUserProfilePic',

    //Notification
    registerToServer:'/notifications/saveDeviceDetails',
    getPushNotifications:'/notifications/getPushNotifications',

    //GPS-setting
    gpsSetting:'/gps/getGpsSettings',
    updateGpsSettings:'/gps/updateGpsSettings',
    getAccountRoutes:'/admin/getAccountRoutes',
    updateAccountRoutes: '/admin/updateAccountRoutes',

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

    lookingForLoad: '/trucks/lookingForLoad',
};

let limiters = {
    userNameLength: 4,
    mobileLength: 10,
    passwordLength: 8,
    otpLength: 6
};






export default {routes, limiters};
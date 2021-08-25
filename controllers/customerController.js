const User = require('../models/User');
const Customer = require('../models/Hubspot/customer');
const _ = require('lodash');
const hubspot = require("../services/hubspot");

module.exports.getHubspotCustomers = async (req, res) => {
  const { _raw, _json, ...userProfile } = req.user;

  const user = await User.findById(userProfile._id);
  let customers = [];
  let result = await hubspot.companies.get('hubspot_owner_id');
  let companies = result.companies;
  if(companies.length > 0){
    for(let i=0;i<companies.length;i++){
      let customer = await Customer.findOne({companyId: companies[i].companyId});
      if(!customer){
        let company = await hubspot.companies.getById(companies[i].companyId);
        let owner = 'N/A';
        if(company.properties.hasOwnProperty('hubspot_owner_id')){
          owner = await hubspot.owners.getById(company.properties.hubspot_owner_id.value)
          owner = `${owner.firstName} ${owner.lastName}`; 
        }
        company.owner = owner;
        company.synced = false;
        console.log(company);
        customers = [...customers, company];
      }else {
        customers = [...customers, customer];
      }
    }
  }

  res.render('hubspot/customers', {
      customers,
      customersCount: customers.length,
      name: userProfile.nickname,
  });
};

module.exports.syncCustomers = async (req, res) => {
  const { _raw, _json, ...userProfile } = req.user;
  const {customers} = req.body;
  const user = await User.findById(userProfile._id);
  try{
  let companies = customers;
  if(companies.length > 0){
    for(let i=0;i<companies.length;i++){
      let company = companies[i];
      let customer = await Customer.findOne({companyId: companies[i].companyId});
      if(!customer){
        customer = new Customer({
          isDeleted: company.isDeleted,
          properties: company.properties,
          synced: company.synced,
          owner: company.owner,
          portalId: company.portalId,
          companyId: company.companyId,
        });
        customer = await customer.save();
      }else {
        customer.isDeleted= company.isDeleted;
        customer.properties= company.properties;
        customer.synced= company.synced;
        customer.owner= company.owner;
        customer.portalId= company.portalId;
        customer.companyId= company.companyId;
        customer = await customer.save();
      }
    }
  }

  req.flash('success_msg', 'Customers Synced');
  res.status(200).send();
  }catch(err){
    console.log(err);
    res.status(400).send(err);
  }
};

module.exports.createCustomer = async (req, res) => {
  // const { _raw, _json, ...userProfile } = req.user;
  
  // const user = await User.findById(userProfile._id);
  
  const body = _.pick(req.body, [
    'companyName',
    'companyOwner',
  ]);

  const companyName = body.companyName;
  const companyOwner = body.companyOwner;

  const companyData = { properties: [ { name: 'name', value: companyName } ] }
  // const contact = { properties: [ { name: 'name', value: companyName } ] }

  let company = await hubspot.companies.create(companyData);

  customer = new Customer({
    companyId: company.companyId,
    portalId: company.portalId,
    properties: company.properties,
  });
  customer = await customer.save();
  
  res.render('admin/employees', {
      
  });
};

module.exports.getSyncedCustomers = async (req, res) => {
  const { _raw, _json, ...userProfile } = req.user;

  const user = await User.findById(userProfile._id);
  let companies = await Customer.find({synced:true});
  let customers = [];
  if(companies.length > 0){
    for(let i=0;i<companies.length;i++){
      let company = await hubspot.companies.getById(companies[i].companyId);
      let owner = 'N/A';
      if(company.properties.hasOwnProperty('hubspot_owner_id')){
        owner = await hubspot.owners.getById(company.properties.hubspot_owner_id.value)
        owner = `${owner.firstName} ${owner.lastName}`; 
      }
      company.owner = owner;
      console.log(company);
      customers = [...customers, company];
    }
  }

  res.render('customers', {
      customers,
      customersCount: customers.length,
      name: userProfile.nickname,
  });
};
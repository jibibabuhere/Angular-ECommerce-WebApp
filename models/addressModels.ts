
export interface AddressS {

  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  zipCode: string;
  city: string;
  state: string;
  phone: string;
}

export interface AddressFormData {
  billingAddress: AddressS;
  shippingAddress: AddressS;
  email: string;
  isShippingSameAsBilling: boolean;
}



export interface BillingFormData extends AddressS {
  email: string;
}

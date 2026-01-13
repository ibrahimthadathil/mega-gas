export interface TransferedInventory  {
    inventory_transaction_id: string,
    transaction_date: string,
    product_name: string,
    product_code: string,
    qty: 100,
    warehouses_info: string[],
    from_warehouse_name: string,
    to_warehouse_name: string,
    source_form_type: string,
    source_form_id: string
  }
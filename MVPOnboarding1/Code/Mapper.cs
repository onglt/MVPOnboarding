using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MVPOnboarding1.Dto;
using MVPOnboarding1.Code;
using System.Reflection.Metadata.Ecma335;

namespace MVPOnboarding1.Code
{
    public static class Mapper
    {
        public static Dto.SaleDto MapSale(Models.Sale Sale)
        {
            var sale = new Dto.SaleDto
            {
                Id = Sale.Id,
                SaleAmount = (decimal)(Sale?.Product.Price),
                CustomerName = Sale?.Customer?.Name,
                ProductName = Sale?.Product?.Name,
                StoreName = Sale?.Store?.Name,
                CustomerId = (int)(Sale.CustomerId),
                ProductId = (int)(Sale.ProductId),
                StoreId = (int)(Sale.StoreId),
                DateSold = Sale.DateSold,                               
            };
            return sale;
        }

        public static Dto.CustomerDto MapCustomerDto(Models.Customer Customer)
        {
            var customer = new CustomerDto();

            if (Customer != null)
            {
                customer = new Dto.CustomerDto
                {
                    Id = Customer.Id,
                    Address = Customer.Address,
                    Name = Customer.Name
                };
            }
            return customer;
        }

        public static Models.Customer MapCustomer(CustomerDto Customer)
        {
            var customer = new Models.Customer();

            if (Customer != null)
            {
                customer.Id = Customer.Id;
                customer.Address = Customer.Address;
                customer.Name = Customer.Name;
            }
            return customer;
        }
    }
}

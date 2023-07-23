namespace MVPOnboarding1.Dto
{
    public class SaleDto
    {
        public int Id { get; set; }

        public decimal SaleAmount { get; set; }

        public string CustomerName { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;

        public string StoreName { get; set; } = string.Empty;

        public int CustomerId { get; set; }

        public int ProductId { get; set; }

        public int StoreId { get; set; }

        public DateTime? DateSold { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace MVPOnboarding1.Models;

public partial class Customer
{
    public int Id { get; set; }

    [Required(ErrorMessage = "A customer name is required")]
    [DisplayName("Customer Name")]
    [StringLength(50)]
    public string? Name { get; set; }

    [Required(ErrorMessage = "A customer address is required")]
    [DisplayName("Customer Address")]
    [StringLength(100)]
    public string? Address { get; set; }

    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}

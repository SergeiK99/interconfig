using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend_Models
{
    public class Device
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string Url { get; set; }
        [Required]
        public double Performance { get; set; }
        [Range(1, int.MaxValue)]
        public int Price { get; set; }
        public int VentilationTypeId { get; set; }
        [ForeignKey("VentilationTypeId")]
        public virtual required VentilationType VentilationType { get; set; }
    }
}

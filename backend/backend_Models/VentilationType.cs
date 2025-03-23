using System.ComponentModel.DataAnnotations;


namespace backend_Models
{
    public class VentilationType
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}

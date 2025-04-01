using System.ComponentModel.DataAnnotations;


namespace BackendModels
{
    /// <summary>
    /// Тип системы вентиляции
    /// </summary>
    public class VentilationType
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
    }
}

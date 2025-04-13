using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendModels.DTOs
{
    //DTO сущности Device для корректного создания
    public class DeviceDto
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public IFormFile Image { get; set; }

        public int PowerConsumption { get; set; }

        public int NoiseLevel { get; set; }

        [Required]
        public int MaxAirflow { get; set; }

        [Range(1, int.MaxValue)]
        public int Price { get; set; }

        public int VentilationTypeId { get; set; }
    }
}

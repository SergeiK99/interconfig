using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend.DTOs
{
    //DTO сущности Device для корректного создания
    public class DeviceDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Название обязательно")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Описание обязательно")]
        public string Description { get; set; } = string.Empty;

        public string? ImagePath { get; set; }

        [Required(ErrorMessage = "Потребление энергии обязательно")]
        [Range(0, int.MaxValue, ErrorMessage = "Потребление энергии не может быть отрицательным")]
        public int PowerConsumption { get; set; }

        [Required(ErrorMessage = "Уровень шума обязателен")]
        [Range(0, int.MaxValue, ErrorMessage = "Уровень шума не может быть отрицательным")]
        public int NoiseLevel { get; set; }

        [Required(ErrorMessage = "Максимальный воздушный поток обязателен")]
        [Range(0, int.MaxValue, ErrorMessage = "Максимальный воздушный поток не может быть отрицательным")]
        public int MaxAirflow { get; set; }

        [Required(ErrorMessage = "Цена обязательна")]
        [Range(1, int.MaxValue, ErrorMessage = "Цена должна быть больше 0")]
        public int Price { get; set; }

        [Required(ErrorMessage = "Тип устройства обязателен")]
        public int DeviceTypeId { get; set; }

        public List<CharacteristicCreateDto>? Characteristics { get; set; } = new List<CharacteristicCreateDto>();
    }
}

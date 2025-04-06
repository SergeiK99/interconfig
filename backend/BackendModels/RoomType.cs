using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendModels
{
    /// <summary>
    /// Справочник типов помещений
    /// </summary>
    public class RoomType
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        //Коэф. куб. метров воздуха в час для каждого квардратного метра (м³/час на м²)
        [Required]
        public double AreaCoefficient { get; set; }
        //Коэф. куб. метров воздуха в час для каждого человека (м³/час на человека)
        [Required]
        public double PeopleCoefficient { get; set; }

    }
}

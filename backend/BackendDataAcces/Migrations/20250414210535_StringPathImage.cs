using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class StringPathImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "Devices");

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "Devices",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "Devices");

            migrationBuilder.AddColumn<byte[]>(
                name: "Image",
                table: "Devices",
                type: "bytea",
                nullable: true);
        }
    }
}

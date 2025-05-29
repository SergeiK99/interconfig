using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BackendDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RenameVentTypeToDeviceType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Devices_VentilationTypes_VentilationTypeId",
                table: "Devices");

            migrationBuilder.DropTable(
                name: "VentilationTypes");

            migrationBuilder.RenameColumn(
                name: "VentilationTypeId",
                table: "Devices",
                newName: "DeviceTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Devices_VentilationTypeId",
                table: "Devices",
                newName: "IX_Devices_DeviceTypeId");

            migrationBuilder.CreateTable(
                name: "DeviceTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceTypes", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Devices_DeviceTypes_DeviceTypeId",
                table: "Devices",
                column: "DeviceTypeId",
                principalTable: "DeviceTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Devices_DeviceTypes_DeviceTypeId",
                table: "Devices");

            migrationBuilder.DropTable(
                name: "DeviceTypes");

            migrationBuilder.RenameColumn(
                name: "DeviceTypeId",
                table: "Devices",
                newName: "VentilationTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Devices_DeviceTypeId",
                table: "Devices",
                newName: "IX_Devices_VentilationTypeId");

            migrationBuilder.CreateTable(
                name: "VentilationTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VentilationTypes", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Devices_VentilationTypes_VentilationTypeId",
                table: "Devices",
                column: "VentilationTypeId",
                principalTable: "VentilationTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

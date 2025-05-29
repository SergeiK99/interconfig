using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ChangePossibleChar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRequired",
                table: "PossibleCharacteristics",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "PossibleCharacteristics",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRequired",
                table: "PossibleCharacteristics");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "PossibleCharacteristics");
        }
    }
}

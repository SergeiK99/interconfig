using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddConfigurations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characteristics_PossibleCharacteristics_PossibleCharacteris~",
                table: "Characteristics");

            migrationBuilder.AddForeignKey(
                name: "FK_Characteristics_PossibleCharacteristics_PossibleCharacteris~",
                table: "Characteristics",
                column: "PossibleCharacteristicId",
                principalTable: "PossibleCharacteristics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characteristics_PossibleCharacteristics_PossibleCharacteris~",
                table: "Characteristics");

            migrationBuilder.AddForeignKey(
                name: "FK_Characteristics_PossibleCharacteristics_PossibleCharacteris~",
                table: "Characteristics",
                column: "PossibleCharacteristicId",
                principalTable: "PossibleCharacteristics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

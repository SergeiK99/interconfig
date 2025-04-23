using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ChangeImageToBytea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Сначала очищаем данные в колонке Image, так как они не могут быть преобразованы
            migrationBuilder.Sql("UPDATE \"Devices\" SET \"Image\" = NULL");
            
            // Теперь можно безопасно изменить тип колонки с использованием USING
            migrationBuilder.Sql("ALTER TABLE \"Devices\" ALTER COLUMN \"Image\" TYPE bytea USING NULL");
            
            // Делаем колонку nullable
            migrationBuilder.Sql("ALTER TABLE \"Devices\" ALTER COLUMN \"Image\" DROP NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "Devices",
                type: "text",
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "bytea");
        }
    }
}

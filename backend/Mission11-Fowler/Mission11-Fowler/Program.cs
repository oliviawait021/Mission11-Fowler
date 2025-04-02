using Microsoft.EntityFrameworkCore;
using Mission11_Fowler.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<BookstoreContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection"));
});

builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactAppBlah",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "https://lively-field-058ea901e.6.azurestaticapps.net")
                .AllowAnyHeader()
                .AllowAnyMethod();
        }));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactAppBlah");

app.UseAuthorization();

app.MapControllers();

app.Run();
#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0.5-alpine3.17-arm64v8 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0.302-alpine3.17-arm64v8 AS build
WORKDIR /src
COPY ["Directory.Build.props", "."]
COPY ["examples/Examples.Service/Examples.Service.csproj", "examples/Examples.Service/"]
RUN dotnet restore "examples/Examples.Service/Examples.Service.csproj"
COPY . .
WORKDIR "/src/examples/Examples.Service"
RUN dotnet build "Examples.Service.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Examples.Service.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Examples.Service.dll"]
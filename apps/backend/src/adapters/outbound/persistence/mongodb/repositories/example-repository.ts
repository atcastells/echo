// Example of how to use the DatabaseConnection in a repository implementation
import { Service, Container } from "typedi";
import { DatabaseConnection } from "../../../../../domain/services/database-connection.js";

@Service()
export class ExampleRepository {
  private readonly databaseConnection: DatabaseConnection =
    Container.get("DatabaseConnection");

  async findAll() {
    const database = this.databaseConnection.getDb();
    const collection = database.collection("examples");
    return await collection.find({}).toArray();
  }

  async create(data: Record<string, unknown>) {
    const database = this.databaseConnection.getDb();
    const collection = database.collection("examples");
    return await collection.insertOne(data);
  }
}

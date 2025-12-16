import { Service, Container } from "typedi";
import { Document } from "../../domain/entities/document.js";
import { DocumentRepository } from "../../domain/ports/outbound/document-repository.js";
import { DOCUMENT_REPOSITORY } from "../../infrastructure/constants.js";

@Service()
export class ListDocumentsUseCase {
  private readonly documentRepository: DocumentRepository = Container.get(DOCUMENT_REPOSITORY);

  async execute(userId: string): Promise<Document[]> {
    return this.documentRepository.findByUserId(userId);
  }
}

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller, SellerStatus } from './seller.entity';
import { ApplySellerDto, ReviewSellerDto } from './seller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepo: Repository<Seller>,
  ) {}

  async apply(dto: ApplySellerDto): Promise<Seller> {
    const existing = await this.sellerRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException(`Seller with email ${dto.email} already exists`);

    const seller = this.sellerRepo.create({ ...dto, status: SellerStatus.PENDING });
    return this.sellerRepo.save(seller);
  }

  async findOne(id: string): Promise<Seller> {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException(`Seller ${id} not found`);
    return seller;
  }

  async getStatus(id: string): Promise<{ id: string; status: SellerStatus; kycVerified: boolean }> {
    const seller = await this.findOne(id);
    return { id: seller.id, status: seller.status, kycVerified: seller.kycVerified };
  }

  async findAll(status?: SellerStatus): Promise<Seller[]> {
    if (status) return this.sellerRepo.find({ where: { status }, order: { createdAt: 'DESC' } });
    return this.sellerRepo.find({ order: { createdAt: 'DESC' } });
  }

  async review(id: string, dto: ReviewSellerDto): Promise<Seller> {
    const seller = await this.findOne(id);
    seller.status = dto.status;
    if (dto.rejectionReason) seller.rejectionReason = dto.rejectionReason;
    if (dto.reviewedBy) seller.reviewedBy = dto.reviewedBy;
    if (dto.status === SellerStatus.APPROVED) seller.kycVerified = true;
    return this.sellerRepo.save(seller);
  }

  async addDocument(id: string, docType: string, docUrl: string): Promise<Seller> {
    const seller = await this.findOne(id);
    const docs = seller.documents || [];
    docs.push({ type: docType, url: docUrl, uploadedAt: new Date().toISOString() });
    seller.documents = docs;
    // Move to under_review once docs are submitted
    if (seller.status === SellerStatus.PENDING) seller.status = SellerStatus.UNDER_REVIEW;
    return this.sellerRepo.save(seller);
  }
}

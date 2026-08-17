import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SellerStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ nullable: true })
  businessAddress: string;

  @Column({ nullable: true })
  businessType: string;   // e.g. sole_proprietor, llc, corporation

  @Column({ type: 'enum', enum: SellerStatus, default: SellerStatus.PENDING })
  status: SellerStatus;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  reviewedBy: string;    // admin user ID who reviewed

  @Column({ type: 'jsonb', nullable: true })
  documents: { type: string; url: string; uploadedAt: string }[];

  @Column({ default: false })
  kycVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
